import axios from "axios";
import { useState, useEffect } from "react";
import { PAGE_CALL } from "../API/APIcall";

const NAVY = "#04233A"; // your premium navy blue

const Component = () => {
  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalpages, setTotalPages]=useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const Ndata = await axios.get(`${PAGE_CALL}?page=${pageNo}`);
        setData(Ndata.data.news);
        setTotalPages(Ndata.data.pagesNo)
        setLoading(false);
      } catch (error) {
        alert("Error Fetching data");
        console.error("error fetching Data", error);
      }
    };
    fetchData();
  }, [pageNo]);

  const handleClick = (item) => {
    console.log("Clicked article:", item);
  };

  return Loading ? (
    <div className="flex items-center justify-center h-screen text-gray-400 text-xl">
      Loading...
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#f8f9fc] to-[#9ba9c9] text-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6" style={{ color: NAVY }}>
        Latest Articles
      </h1>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-4xl w-full">
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item)}
            className="border-2 p-6 rounded-xl shadow-lg cursor-pointer transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              borderColor: NAVY,
              backgroundColor: "#f8fafc" // light background inside card
            }}
          >
            <h2
              className="font-semibold text-xl mb-3"
              style={{ color: NAVY }}
            >
              {item.title}
            </h2>
            <p className="text-sm" style={{ color: NAVY }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination buttons */}
      <div className="flex flex-row gap-6 mt-6">
        <button
          onClick={() => setPageNo((prev) => Math.max(prev - 1, 1))}
          className="px-5 py-2 font-semibold rounded transition"
          style={{ backgroundColor: NAVY, color: "white" }}
        >
          Previous
        </button>
        {totalpages > pageNo &&
        <button
          onClick={() => setPageNo((prev) => prev + 1)}
          className="px-5 py-2 font-semibold rounded transition"
          style={{ backgroundColor: NAVY, color: "white" }}
        >
          Next
        </button>
  }
      </div>
    </div>
  );
};

export default Component;
