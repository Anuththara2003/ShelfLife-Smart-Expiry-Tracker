import { LoaderContext } from "../context/LoaderContext"
import { useContext } from "react"

const useLoader = () => {
    const constext = useContext(LoaderContext);

    if (!constext) {
        throw new Error("useLoader must be used within a LoaderProvider");
    }

    return constext
}

export default useLoader;