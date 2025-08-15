import axios from "axios";
import { useState, useEffect } from "react";
import { API ,PAGE_CALL } from "../API/APIcall";

const NAVY = "#04233A"; // your premium navy blue

const Component = () => {
  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalpages, setTotalPages] = useState(1);
  const [openUI, setopenUI] = useState(false)
  const [itemVal, setitemVal] = useState(0)
  const [analyzed, setanalyzed] = useState(false)
  const [analyzedData, setanalyzedData] = useState({});

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
      }
    };
    fetchData();
  }, [pageNo]);

  const handleClick = (index) => {
    setitemVal(index);
    setopenUI(true);
  };

  const doAnalyze=async()=>{
     try {
    const stringToAnalyze = `${data[itemVal].title} ${data[itemVal].description} ${data[itemVal].Details}`;
    
    const response = await axios.post(`${API}/analyze`, { text: stringToAnalyze });

    if (response.status === 200) {
      setanalyzed(true);
      setanalyzedData(response.data);
    }
  } catch (error) {
    console.error(error);
    alert("Error analyzing article");
    return;
  }
  }

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
            onClick={() => handleClick(index)}
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
      <div className="flex flex-col gap-2 mt-6">
        <span>
          Page {pageNo} of {totalpages}
        </span>
        <div className="flex flex-row gap-6">
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
      {openUI && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50"
        >
          {/* Modal Box */}
          <div
            className="relative rounded-2xl shadow-2xl p-8 flex flex-col gap-4"
            style={{
              width: "60%",
              height: "75%",
              backgroundColor: "#f8fafc", // matching card background
              border: `2px solid ${NAVY}`,
              color: NAVY,
              overflowY: "auto"
            }}
          >
            {/* Close Button */}
            <button
              onClick={() =>{ setopenUI(false)
                setanalyzed(false)}
              }
              className="absolute top-4 right-4 text-lg font-bold px-3 py-1 rounded-full hover:bg-gray-200 transition"
              style={{ color: NAVY }}
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-4" style={{ color: NAVY }}>
              Article
            </h3>

            <div className="text-xl font-semibold">{data[itemVal]?.title}</div>
            <div className="text-base">{data[itemVal]?.description}</div>
            <div className="text-sm mt-2">{data[itemVal]?.Details}</div>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Analyze Button */}
            {!analyzed ?
              <button
              className="px-5 py-2 font-semibold rounded transition self-start"
              style={{
                backgroundColor: NAVY,
                color: "white"
              }}
              onClick={() => doAnalyze() }
            >
              Analyze
            </button>
          :
          <div>
            <div className="text-lg font-semibold mb-2">Analysis Result:</div>
            <div className="text-base"> {analyzedData} </div>
          </div>  
          }
          </div>
        </div>
      )}

    </div>
  );
};

export default Component;
