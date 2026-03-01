
 const getDay = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
  };

 

export default getDay;