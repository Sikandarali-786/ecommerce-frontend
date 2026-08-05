import video1 from '../assets/video/WhatsApp Video 2026-08-01 at 11.41.09 PM.mp4';
import video2 from '../assets/video/WhatsApp Video 2026-08-01 at 11.41.58 PM.mp4';
import video3 from '../assets/video/WhatsApp Video 2026-08-01 at 11.43.20 PM.mp4';

const videoItems = [
  {
    src: video1,
  },
  {
    src: video2,
  },
  {
    src: video3,
  },
  {
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
        {videoItems.map((item, index) => (
          <div key={index} className="group overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200">
            <div className="relative overflow-hidden rounded-t-3xl bg-slate-900">
              <video
                className="w-full h-[500px] aspect-[9/16] object-cover"
                src={item.src}
                controls
                muted
                playsInline
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoShowcase;
