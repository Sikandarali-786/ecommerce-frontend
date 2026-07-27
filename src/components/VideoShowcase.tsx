const videoItems = [
  {
    title: 'Tanks Installation',
    label: 'Watch Now',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    title: 'Rims Styling',
    label: 'Watch Now',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/boat.mp4',
  },
  {
    title: 'Silencer Sound Test',
    label: 'Watch Now',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    title: 'LED Lights Showcase',
    label: 'Watch Now',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/boat.mp4',
  },
];

const VideoShowcase = () => {
  return (
    <section className="py-16 w-full px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="mx-auto max-w-7xl text-center mb-10">
        <p className="text-xs uppercase tracking-[0.28em] text-orange-600 font-bold mb-2">Watch product stories</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Customer Video Reviews</h2>
        <p className="text-sm text-slate-500 mt-2">See our products in action and learn why customers love them.</p>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {videoItems.map((item) => (
          <div key={item.title} className="group overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200">
            <div className="relative overflow-hidden rounded-t-3xl bg-slate-900">
              <video
                className="w-full h-64 object-cover"
                src={item.src}
                controls
                muted
                playsInline
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoShowcase;
