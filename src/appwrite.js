const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTIONS_ID
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID



export const updateSearchCount = async () =>{
    console.log(DATABASE_ID, COLLECTION_ID, PROJECT_ID);
}