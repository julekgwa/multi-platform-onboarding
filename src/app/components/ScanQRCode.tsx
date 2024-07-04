import QRCode from 'react-qr-code';
import { socket } from '../socket';
import React from 'react';
import { User } from '../../App';

type Props = {
  applicationId: string;
  setImage: (image: string) => void;
};

export function ScanQRCode(props: Props) {

  React.useEffect(() => {

    function handleSelfie(data: User) {
      console.log('data', data);
      props.setImage(data.selfie);
    }

    socket.on('saved-selfie', handleSelfie)

    return () => {
      socket.off('saved-selfie', handleSelfie);
    };
  }, []);

  return (
    <section className='flex flex-col items-center'>
      <div className='lg:w-[1030px] md:w-[760px] space-y-3 mx-0 lg:mx-5 lg:px-5 px-4 w-full max-w-full mt-[40px]'>
        <div className='space-y-4'>
          <h1 className='text-3xl font-medium'>Continue on your phone</h1>
          <h3>Scan the QR Code with your phone</h3>
        </div>

        <div className='flex justify-center pt-5'>
          <QRCode
            size={256}
            value={`${window.location.origin}/selfie/${props.applicationId}`}
            viewBox={`0 0 256 256`}
          />
        </div>
      </div>
    </section>
  );
}
