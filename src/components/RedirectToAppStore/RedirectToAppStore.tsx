import { useEffect } from 'react';

const RedirectToAppStore = () => {
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    console.log( /android/i.test(userAgent));
    
    if (/android/i.test(userAgent)) {
      // Redirigir a Google Play para dispositivos Android
      window.location.href = 'https://play.google.com/apps/internaltest/4701024993771966175';
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      // Redirigir a App Store para dispositivos iOS
      console.log("Link para dispositivo iOS");
      
    //   window.location.href = 'https://apps.apple.com/app/id1234567890';
    } else {
      // Opcionalmente, redirigir a una página de descarga genérica
      window.location.href = 'https://app-cobquecura.vercel.app';
    }
  }, []);

  return <div>Redirigiendo a Play Store...</div>;;
};

export default RedirectToAppStore;
