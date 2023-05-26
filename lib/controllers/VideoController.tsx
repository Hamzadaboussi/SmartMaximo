export const startTiimer = (
    setTimerId: React.Dispatch<React.SetStateAction<number>>,
    timerId : number,
    setStartTime: React.Dispatch<React.SetStateAction<number>>
) => {
    if (timerId === null) {
      console.log('yaaaaa')
      setStartTime(Date.now());
      const id = setTimeout(() => {
        setTimerId(0);
      }, 60000); // Set the timer to end after 1 minute (adjust as needed)
      setTimerId(id);
    }
  };

  const stopTimer = (
    setTimerId: React.Dispatch<React.SetStateAction<null|number>>,
    timerId : number,
  ) => {
    if (timerId !== null) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  };

  export const formatTime = (timeInSeconds:number) => {
    console.log('this is time ',timeInSeconds)
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
  
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };
  