import {toast} from 'react-hot-toast';
import {apiConnector} from '../apiconnector';
import {catalogData} from '../apis';

export const getCatalogPageData = async(categoryId) => {
    const toastId = toast.loading("Loading...");
    let result = [];
    try{
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {categoryId: categoryId});

        if(!response?.data?.success){
            throw new Error("Could not Fetch category page data");
        }

        result = response?.data;
    }
    catch(error){
        console.log("Catalog page data api error...", error);
        toast.error(error.message);
        result = error?.data;
    }

    toast.dismiss(toastId);
    return result;
}
