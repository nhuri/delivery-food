import { apiSlice } from "./apiSlice";
import { MENUITEMS_URL, MENU_URL } from "./urlConstrains";

const menuApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenuByRestaurantId: builder.query({
      query: (restaurantId) => ({
        url: `${MENU_URL}/${restaurantId}`,
      }),
      keepUnusedDataFor: 5,
      provideTags: ["Menu"],
    }),
    getMenuItems: builder.query({
      query: () => ({
        url: MENUITEMS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Menu"],
    }),
    getMenuItemById: builder.query({
      query: (menuId) => ({
        url: `${MENUITEMS_URL}/${menuId}`,
      }),
      keepUnusedDataFor: 5,
      provideTags: ["Menu"],
    }),
    createMenuItem: builder.mutation({
      query: ({ formData, menuId }) => ({
        url: `${MENU_URL}/${menuId}/items`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Menu"],
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data: newItem } = await queryFulfilled;
      //     dispatch(
      //       menuApiSlice.util.updateQueryData(
      //         "getMenuByRestaurantId",
      //         arg.menuId,
      //         (draft) => {
      //           const menu = draft.find((m) => m._id === arg.menuId);
      //           if (menu) {
      //             menu.items.push(newItem);
      //           }
      //         }
      //       )
      //     );
      //   } catch {
      //     // If the mutation fails, we don't need to do anything
      //   }
      // },
    }),
    updateMenuItem: builder.mutation({
      query: ({ menuId, data }) => ({
        url: `${MENUITEMS_URL}/${menuId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Menu"],
    }),
    deleteMenuItem: builder.mutation({
      query: ({ menuId }) => ({
        url: `${MENUITEMS_URL}/${menuId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Menu"],
    }),
  }),
});

export const {
  useGetMenuByRestaurantIdQuery,
  useGetMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuApiSlice;
