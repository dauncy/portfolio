/**
 * 
 * @param time time in miliseconds
 */
export const sleep = async (time: number) => {
  const promise = new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(time);
    }, time)
  });
  return  await Promise.resolve(promise)
}
