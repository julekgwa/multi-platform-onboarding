import React from 'react';
import Webcam from 'react-webcam';
import LoadingOverlay from 'react-loading-overlay-ts';
import { useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function Selfie() {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'environment',
  };

  const webcamRef = React.useRef<Webcam>(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (imageSrc) setImage(imageSrc);
  }, [webcamRef]);
  const [image, setImage] = React.useState<string | ImageData>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [appSubmitted, setAppSubmitted] = React.useState(false);

  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    const submitImage = async () => {
      setIsSubmitting(true);
      const response = await fetch(`${BASE_URL}/api/v1/selfie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // get app id from params
        body: JSON.stringify({ selfie: image, id: id }),
      });
      const data = await response.json();

      setIsSubmitting(false);
      setAppSubmitted(data._id || true);
    };

    if (image) {
      submitImage();
    }
  }, [image, id]);

  return (
    <div>
      {appSubmitted && (
        <div className='flex justify-center items-center h-[100vh] px-6'>
          {' '}
          <h1>Application submitted. You can close this tab now.</h1>{' '}
        </div>
      )}
      {!appSubmitted && (
        <LoadingOverlay
          active={isSubmitting}
          spinner
          text='Submitting selfie...'
          className='relative h-[100vh] w-full flex justify-center items-center bg-emerald-500 px-3'
        >
          <div className='w-96 h-96'>
            <Webcam
              audio={false}
              height={720}
              screenshotFormat='image/jpeg'
              width={1280}
              videoConstraints={videoConstraints}
              ref={webcamRef}
            />
          </div>
          <div className='absolute bg-emerald-500 bottom-0 p-5 w-full flex justify-center'>
            <button
              className='bg-white px-7 py-3 rounded-full'
              onClick={() => {
                capture();
              }}
            >
              Take a random photo
            </button>
          </div>
        </LoadingOverlay>
      )}
    </div>
  );
}
