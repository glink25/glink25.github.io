export const formatDate = (d: number) => {
  const date= new Date(d)
  const year=date.getFullYear()
  const month=date.getMonth()
  const days=date.getDate()
  return `${year}-${month}-${days}`
};
