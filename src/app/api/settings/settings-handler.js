export function createHandler({
  getService,
  postService,
  putService,
  deleteService,
}) {
  return {
    async GET(request) {
      const { searchParams } = request.nextUrl;
      let page = searchParams.get("page");
      let limit = searchParams.get("limit");
      page = page ? Number(page) : 1;
      limit = limit ? Number(limit) : 10;
      try {
        const data = await getService(page, limit);
        return Response.json({
          ...data,
        });
      } catch (e) {
        console.log(e);
        return Response.json({
          status: 500,
          message: e.message,
        });
      }
    },

    async POST(request) {
      const data = await request.json();
      try {
        const req = await postService(data);
        return Response.json({
          data: req,
          message: "تم الإضافة بنجاح",
          status: 200,
        });
      } catch (e) {
        console.log(e);
        return Response.json({
          status: 500,
          message: e.message,
        });
      }
    },

    async PUT(request, { params }) {
      const data = await request.json();
      const { id } = params;
      try {
        const req = await putService(+id, data);
        return Response.json({
          data: req,
          message: "تم التعديل بنجاح",
          status: 200,
        });
      } catch (e) {
        console.log(e);
        return Response.json({
          status: 500,
          message: e.message,
        });
      }
    },

    async DELETE(request, { params }) {
      const { id } = params;
      try {
        const req = await deleteService(+id);
        return Response.json({
          data: req,
          message: "تم الحذف بنجاح",
          status: 200,
        });
      } catch (e) {
        console.log(e);

        return Response.json({
          status: 500,
          message: e.message,
        });
      }
    },
  };
}
