import { useEffect, useState } from "react";
import api from "../api/axios";

function Users() {
    const [count, setCount] = useState(0);
    const [data, setData]= useState("");


    useEffect(()=> {
        api.get("users/all")
            .then((response) => {setData(response.data)});

        console.log(data);
    },[]);

    return(
        <>
            <pre>{data.email}</pre>
            <h1>{count}</h1>
            <button onClick={() => setCount(count+1)}>
                Increase
            </button>
        </>
    )
}

export default Users;