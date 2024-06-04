export async function getData({
  url = "",
  setLoading,
  page,
  limit,
  filters,
  search,
  sort,
}) {
  try {
    setLoading(true);
    const response = await fetch(
      `/api/${url}?page=${page}&limit=${limit}&filters=${JSON.stringify(filters)}&search=${search}&sort=${JSON.stringify(sort)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      },
    );

    return response.json();
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
}
