import { NextRequest, NextResponse } from 'next/server';

// IMPORTANT: This API key is server-side only and never exposed to the browser
const LLAMAINDEX_API_KEY = process.env.LLAMAINDEX_API_KEY;
const LLAMAINDEX_API_URL = 'https://api.cloud.llamaindex.ai/api/v1/parsing/upload';

export async function POST(request: NextRequest) {
    try {
        // Validate API key exists
        if (!LLAMAINDEX_API_KEY) {
            console.error('LLAMAINDEX_API_KEY is not configured');
            return NextResponse.json(
                { error: 'PDF extraction service is not configured. Please contact support.' },
                { status: 500 }
            );
        }
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
        }

        // Create form data for LlamaIndex API
        const apiFormData = new FormData();
        apiFormData.append('file', file);

        // Call LlamaIndex API
        const response = await fetch(LLAMAINDEX_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LLAMAINDEX_API_KEY}`,
            },
            body: apiFormData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to process PDF');
        }

        const result = await response.json();

        // Wait for processing to complete (if job_id is returned)
        if (result.id || result.job_id) {
            const jobId = result.id || result.job_id;
            console.log(`PDF processing started. Job ID: ${jobId}`);

            // Poll for results with exponential backoff
            const maxAttempts = 60; // 60 seconds max (increased for larger files)
            let attempt = 0;

            for (let i = 0; i < maxAttempts; i++) {
                attempt++;

                // Wait 1 second between polls
                await new Promise(resolve => setTimeout(resolve, 1000));

                try {
                    const statusResponse = await fetch(
                        `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}/result/markdown`,
                        {
                            headers: {
                                'Authorization': `Bearer ${LLAMAINDEX_API_KEY}`,
                            },
                        }
                    );

                    // Success - job completed
                    if (statusResponse.ok) {
                        const markdown = await statusResponse.text();
                        console.log(`PDF processing completed successfully after ${attempt} attempts`);

                        // The markdown response might be JSON wrapped, try to parse it
                        let cleanMarkdown = markdown;
                        try {
                            const parsed = JSON.parse(markdown);
                            // If it's JSON with a markdown field, extract it
                            if (parsed.markdown) {
                                cleanMarkdown = parsed.markdown;
                            } else if (typeof parsed === 'string') {
                                cleanMarkdown = parsed;
                            }
                        } catch {
                            // If not JSON, use as-is
                            cleanMarkdown = markdown;
                        }

                        return NextResponse.json({
                            text: cleanMarkdown,
                            jobId: jobId,
                            processingTime: attempt
                        });
                    }

                    // Still processing
                    if (statusResponse.status === 202) {
                        console.log(`PDF processing in progress... (attempt ${attempt}/${maxAttempts})`);
                        continue;
                    }

                    // Job failed or not found
                    if (statusResponse.status === 404) {
                        throw new Error('PDF processing job not found');
                    }

                    // Other errors
                    const errorData = await statusResponse.json().catch(() => ({ message: 'Unknown error' }));
                    throw new Error(errorData.message || `Processing failed with status ${statusResponse.status}`);
                } catch (pollError: any) {
                    // Log polling errors but continue trying
                    console.error(`Polling error on attempt ${attempt}:`, pollError.message);

                    // Only throw if it's not a network error and we're past halfway
                    if (attempt > maxAttempts / 2 && !pollError.message.includes('fetch')) {
                        throw pollError;
                    }
                }
            }

            throw new Error(`Processing timeout after ${maxAttempts} seconds. The file may be too large or complex.`);
        }

        // If text is directly returned
        const extractedText = result.text || result.markdown || JSON.stringify(result, null, 2);

        return NextResponse.json({ text: extractedText });
    } catch (error: any) {
        console.error('PDF extraction error:', error);
        return NextResponse.json(
            { error: error.message || 'An error occurred during PDF extraction' },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
