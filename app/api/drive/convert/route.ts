import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const accessToken = formData.get('accessToken') as string;

        if (!file || !accessToken) {
            return NextResponse.json(
                { error: 'File and access token are required' },
                { status: 400 }
            );
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const drive = google.drive({ version: 'v3', auth });

        // Convert File to Stream
        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        const fileMetadata = {
            name: file.name, // Keep original name with extension
            // mimeType: not specified, so Drive stores it as-is without conversion
        };

        const media = {
            mimeType: file.type,
            body: stream,
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name, webViewLink, webContentLink',
        });

        return NextResponse.json({
            id: response.data.id,
            name: response.data.name,
            link: response.data.webViewLink,
        });

    } catch (error: any) {
        console.error('Drive API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload to Drive' },
            { status: 500 }
        );
    }
}
