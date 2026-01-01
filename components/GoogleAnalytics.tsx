export default function GoogleAnalytics() {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

    // Don't render if GA_ID is not set
    if (!GA_ID) {
        return null;
    }

    return (
        <>
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
                id="google-analytics"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_ID}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </>
    );
}
