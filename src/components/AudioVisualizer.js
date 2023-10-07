import React, { useEffect, useRef } from 'react';

function AudioVisualizer({ audioRef }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audio);
      sourceNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      analyserRef.current.fftSize = 256;
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawBars = () => {
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * 2;

        canvasCtx.fillStyle = 'rgb(0, 0, 255)';
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }


      requestAnimationFrame(drawBars);
      
    };

    audio.addEventListener('play', () => {
      audioContextRef.current.resume().then(() => {
        drawBars();
      });
    });

    return () => {
      audio.removeEventListener('play', () => {});
    };
  }, [audioRef]);

  return (
    <div style={{marginLeft: '-104px'}} >
      <canvas ref={canvasRef} width={600} height={400} />
    </div>
  );
}

export default AudioVisualizer;
