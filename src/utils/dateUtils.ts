export const formatDateTo_DD_MM_AAAA = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() es cero-indexado
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

export const formatDateTo_YYYY_MM_DD = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };