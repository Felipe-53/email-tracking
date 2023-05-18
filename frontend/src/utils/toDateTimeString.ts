export function toDateTimeString(date: Date) {
  return (
    date.toLocaleDateString("pt-bt", {
      timeZone: "America/Recife",
    }) +
    " " +
    date.toLocaleTimeString("pt-br", {
      timeZone: "America/Recife",
    })
  );
}
