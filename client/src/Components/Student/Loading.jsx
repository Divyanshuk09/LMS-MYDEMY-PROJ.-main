import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import animation from "../../assets/Animation.json";

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [path, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Player
        autoplay
        loop
        src={animation}
        style={{ height: "300px", width: "300px" }}
      />
    </div>
  );
};

export default Loading;
