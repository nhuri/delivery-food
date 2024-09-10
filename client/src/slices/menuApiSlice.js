import { apiSlice } from "./apiSlice";
import { MENU_URL } from "./urlConstrains";
const menuApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenuItems: builder.query({
      query: () => ({
        url: MENU_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getMenuItemById: builder.query({
      query: (menuId) => ({
        url: `${MENU_URL}/${menuId}`,
      }),
      keepUnusedDataFor: 5,
      provideTags: ["Task"],
    }),
    createMenuItem: builder.mutation({
      query: (data) => ({
        url: `${MENU_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateMenuItem: builder.mutation({
      query: ({ menutId, data }) => ({
        url: `${MENU_URL}/${menuId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteMenuItem: builder.mutation({
      query: ({ menutId }) => ({
        url: `${MENU_URL}/${menuId}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useGetMenuQuery,
  useMenuGetByIdQuery,
  useAddMenuMutation,
  useEditMenuMutation,
  useDeleteMenuMutation,
} = menuApiSlice;
