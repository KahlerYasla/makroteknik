import { create } from "zustand"
import axios from "axios"

export const useProductStore = create((set, get) => ({
    apiUrl: process.env.REACT_APP_API_URL ?? "http://localhost:8855",
    productsList: [],
    categoriesList: [],
    loading: 2,
    pdfMetaLoading: false,

    getProducts: async () => {
        try {
            const { apiUrl } = get()
            const response = await axios.get(`${apiUrl}/product`)
            set({
                productsList: response.data.products,
                loading: get().loading - 1,
            }) // Set products and stop loading
        } catch (err) {
            console.error(err)
        }
    },

    getCategories: async () => {
        try {
            const { apiUrl } = get()
            const response = await axios.get(`${apiUrl}/category`)
            set({
                categoriesList: response.data.categories,
                loading: get().loading - 1,
            }) // Assuming categories are directly in the response
        } catch (err) {
            console.error(err)
            set({ categoriesList: [] }) // Set empty categories on error
        }
    },

    postProduct: async (product) => {
        try {
            const { apiUrl } = get()

            // Ensure categoryID is properly set
            if (!product.categoryID || product.categoryID === 0) {
                product.categoryID = "0"
            }

            // Send the data to the API
            const response = await axios.post(
                `${apiUrl}/product/post`,
                product,
                {
                    headers: {
                        "Content-Type": "application/json", // Adjust if you're sending JSON
                    },
                }
            )

            product._id = response.data.productID

            // Add the new product to state
            set((state) => ({
                productsList: [...state.productsList, product],
                loading: 0,
            }))

            return product._id
        } catch (err) {
            console.error("Error posting product:", err)
        }
    },

    patchProduct: async (id, formData) => {
        try {
            const { apiUrl } = get()
            console.log(formData)
            const response = await axios.patch(
                `${apiUrl}/product/patch/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json", // Adjust as needed
                    },
                }
            )
            console.log(response)
            set((state) => ({
                productsList: state.productsList.map((product) =>
                    product._id === id ? formData : product
                ),
                loading: 0,
            })) // Update product
        } catch (err) {
            console.error(err)
            console.log("Error response:", err.response)
        }
    },

    deleteProduct: async (id) => {
        try {
            const { apiUrl } = get()
            await axios.delete(`${apiUrl}/product/delete/${id}`)
            set((state) => ({
                productsList: state.productsList.filter(
                    (product) => product._id !== id
                ),
            })) // Remove product
        } catch (err) {
            console.error(err)
        }
    },

    getPDF: async (id) => {
        try {
            const { apiUrl } = get()

            // Fetch the PDF as a blob
            const res = await axios.get(`${apiUrl}/static/pdf/${id}`, {
                responseType: "blob",
            })

            // Create a Blob URL for the PDF
            const PDFBlob = new Blob([res.data], { type: "application/pdf" }) // Explicitly set the type
            const PDFURL = window.URL.createObjectURL(PDFBlob)

            // Open the PDF URL in a new tab
            window.open(PDFURL, "_blank")

            // Optionally, clean up the Blob URL after some delay
            setTimeout(() => {
                window.URL.revokeObjectURL(PDFURL)
            }, 5000)
        } catch (err) {
            console.error("Error opening the PDF:", err)
        }
    },

    postPDF: async (id, file, fileName) => {
        try {
            const { apiUrl } = get()

            // prepare FormData for the file upload
            const formData = new FormData()
            formData.append("file", file)

            // make API call to upload the PDF
            const response = await axios.post(
                `${apiUrl}/static/pdf/upload/${id}/${fileName}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // required for file upload
                    },
                }
            )

            console.log("PDF file uploaded successfully:", response.data)
        } catch (err) {
            console.error("error uploading the PDF file:", err)
        }
    },

    startPDFMetaLoading: () => {
        set({
            pdfMetaLoading: true,
        })
    },

    getPDFMeta: async (id) => {
        try {
            const { apiUrl } = get()

            // make the API call
            const response = await axios.get(`${apiUrl}/static/pdf/meta/${id}`)

            if (response.data.Size !== undefined) {
                console.log("getPDFMeta successful:", response.data)

                set({
                    productsList: get().productsList.map((product) =>
                        product._id === id
                            ? { ...product, pdfMeta: response.data }
                            : product
                    ),
                })

                set({
                    pdfMetaLoading: false,
                })

                return true
            } else {
                set({
                    pdfMetaLoading: false,
                })

                return false
            }
        } catch (err) {
            set({
                pdfMetaLoading: false,
            })

            console.error("error getting metadata of the PDF", err)
            return false
        }
    },
}))
