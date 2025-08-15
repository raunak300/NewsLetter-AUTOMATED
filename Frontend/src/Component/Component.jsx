import axios from "axios";
import { useState, useEffect } from "react";
import { PAGE_CALL } from "../API/APIcall";

const Component = () => {
  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`${PAGE_CALL}page=${pageNo}`);
        const Ndata = await axios.get(`${PAGE_CALL}?page=${pageNo}`);
        setData(Ndata.data.news);
        console.log("data fetched succesfully", Ndata);
        setLoading(false);
      } catch (error) {
        alert("Error Fetching data");
        console.error("error fetching Data", error);
      }
    }
    fetchData()
  }, [pageNo])

  const handleClick = () => {}

  return (
    (Loading ?
      <div className="flex items-center justify-center h-screen text-gray-400 text-xl">
        Loading...
      </div> :
      <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-indigo-400">Latest Articles</h1>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-4xl w-full">
          {data.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item)}
              className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg cursor-pointer transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h2 className="font-semibold text-xl mb-3 text-white">{item.title}</h2>
              <p className="text-gray-300 text-sm line-clamp-3">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-6 mt-6">
          <button className="px-5 py-2 bg-indigo-500 text-gray-900 font-semibold rounded hover:bg-yellow-400 transition">
            Previous
          </button>
          <button className="px-5 py-2 bg-indigo-500 text-gray-900 font-semibold rounded hover:bg-yellow-400 transition">
            Next
          </button>
        </div>
      </div>)
  );
};

export default Component;
