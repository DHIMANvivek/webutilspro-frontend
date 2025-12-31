import AdUnit from './ads/AdUnit';

export default function AdPlacement({
    slot = 'auto',
    format = 'auto',
    responsive = true
}: {
    slot?: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
    responsive?: boolean;
}) {
    // Show live ad if we have a real slot, otherwise show professional placeholder
    return (
        <div className="my-12 flex justify-center items-center">
            <div className="w-full max-w-4xl">
                {slot === 'auto' ? (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center group hover:border-blue-200 transition-colors">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-xl">📊</span>
                        </div>
                        <p className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-widest">Sponsored Placement</p>
                        <p className="text-xs text-slate-400 font-medium">
                            Relevant advertisements will appear here to support our free tools.
                        </p>
                    </div>
                ) : (
                    <AdUnit slot={slot} format={format} responsive={responsive} />
                )}
            </div>
        </div>
    );
}
