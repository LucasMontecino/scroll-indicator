/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useState } from "react";
import "./scroll.css";

export default function ScrollIndicator({ url }) {
  const [data, setData] = useState([]);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  function handleScrollIndicator() {
    // console.log(
    //   document.body.scrollTop,
    //   document.documentElement.scrollTop,
    //   document.documentElement.scrollHeight,
    //   document.documentElement.clientHeight
    // );

    const howMuchScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    setScrollPercentage((howMuchScroll / height) * 100);
  }

  async function fetchData(getUrl) {
    try {
      setLoading(true);

      const response = await fetch(getUrl);
      const data = await response.json();

      if (data && data.products && data.products.length > 0) {
        setData(data.products);
        setLoading(false);
      }
    } catch (error) {
      setErrors(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(url);
  }, [url]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollIndicator);

    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);

  if (loading) {
    return <p>Please wait a few seconds</p>;
  }

  if (errors !== null) {
    return <p style={{ color: "#E74C3C" }}>{errors}</p>;
  }

  console.log(scrollPercentage);

  return (
    <div className="main-container">
      <div className="top-container">
        <h1>Scroll Indicator Products</h1>

        <div className="scroll-progress-container">
          <div
            className="scroll-progress"
            style={{ width: `${scrollPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="container">
        {data && data.length > 0
          ? data.map((item) => <p key={item.id}>{item.title}</p>)
          : null}
      </div>
    </div>
  );
}
