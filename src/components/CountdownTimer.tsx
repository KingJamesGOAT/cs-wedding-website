import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function CountdownTimer() {
  const { t } = useLanguage();
  const weddingDate = new Date('2026-06-27T14:00:00+02:00'); // Wedding date: June 27, 2026 at 14:00

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: t('home.days') },
    { value: timeLeft.hours, label: t('home.hours') },
    { value: timeLeft.minutes, label: t('home.minutes') },
    { value: timeLeft.seconds, label: t('home.seconds') },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="text-3xl md:text-4xl tracking-wide text-white font-bold mb-4">{t('home.saveDate')}</h3>
      <div className="grid grid-cols-4 gap-3 sm:gap-6">
        {timeUnits.map((unit, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 min-w-[70px] sm:min-w-[90px]"
          >
            <div className="text-3xl sm:text-4xl text-white tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm text-white/80 mt-1">{unit.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
