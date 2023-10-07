import React, { useRef, useEffect } from 'react';

const Waveform = ({ audioUrl, currentTime, duration, onSeekBarChange, playPause }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawWaveform = async () => {
      const audio = new Audio(audioUrl);
      await audio.load();

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audio);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const width = canvas.width;
      const height = canvas.height;
      const sliceWidth = (width * 1.0) / bufferLength;

      audio.play();

      const draw = () => {
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0, 255, 0)';
        ctx.beginPath();

        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        requestAnimationFrame(draw);
      };

      draw();
    };

    drawWaveform();

  }, [audioUrl]);

  return <canvas ref={canvasRef} />;
};

export default Waveform;
