import * as React from "react";
import { render } from "react-dom";
import Hls from "hls.js";



const Livestreaming = () => {
    const videoRef = React.useRef(null);
    const src = "https://cdn.livepeer.com/hls/78bafaxjg2ovlhrr/index.m3u88";
  
    React.useEffect(() => {
     var hls;
      if (videoRef.current) {
        const video = videoRef.current;
  
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // Some browers (safari and ie edge) support HLS natively
          video.src = src;
        } else if (Hls.isSupported()) {
          // This will run in all other modern browsers
          hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          console.error("This is a legacy browser that doesn't support MSE");
        }
      }
  
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }, [videoRef]);
  
    return (
      <video
        controls
        ref={videoRef}
        style={{ width: "100%", height: "100%" }}
      />
    );
}

export default Livestreaming;