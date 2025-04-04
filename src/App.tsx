import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

type Data = {
	audioUrl: string;
	createdAt: string;
	date: string;
	filename: string;
	newsLinks: {
		date: string;
		link: string;
		title: string;
	}[];
};

function App() {
	const BASE_URL = import.meta.env.VITE_BASE_URL;
	const [data, setData] = useState<Data | null>(null);

	useEffect(() => {
		const fetchNews = async () => {
			// Check if we have cached data
			const cachedData = localStorage.getItem("newsData");
			const cachedTimestamp = localStorage.getItem("newsTimestamp");

			if (cachedData && cachedTimestamp) {
				const timestamp = Number.parseInt(cachedTimestamp);
				const now = Date.now();
				// Cache for 1 hour (3600000 milliseconds)
				if (now - timestamp < 3600000) {
					setData(JSON.parse(cachedData));
					return;
				}
			}

			try {
				const res = await axios.get(`${BASE_URL}/news`);
				setData(res.data);
				// Cache the new data
				localStorage.setItem("newsData", JSON.stringify(res.data));
				localStorage.setItem("newsTimestamp", Date.now().toString());
			} catch (error) {
				console.error("Error fetching news:", error);
			}
		};

		fetchNews();
	}, []);
	return (
		<div className="min-h-screen bg-[#f4f1ea] p-8 font-serif">
			<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 border-2 border-gray-200">
				<div className="border-b-2 border-gray-900 pb-4 mb-8">
					<h1 className="text-4xl font-bold text-gray-900 tracking-tight">
						Latest News
					</h1>
					<span className="text-sm text-gray-600 italic">
						{new Date().toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</span>
				</div>

				<div className="mb-8">
					<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
						<h2 className="text-lg font-semibold mb-3 text-gray-800">
							Latest Audio Summary
						</h2>
						<audio
							src={data?.audioUrl}
							title="Latest News"
							controls
							className="w-full h-12 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<track kind="captions" src="" />
						</audio>
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2">
						Latest Headlines
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{data?.newsLinks.map((news) => (
							<a
								href={news.link}
								target="_blank"
								rel="noopener noreferrer"
								className="group block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 hover:border-gray-400"
								key={news.link}
							>
								<h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
									{news.title}
								</h3>
							</a>
						))}
					</div>
				</div>
			</div>
			<footer className="max-w-4xl mx-auto mt-8 text-center text-sm text-gray-600">
				<p className="font-serif italic">
					Made with ❤️ by{" "}
					<a
						href="https://mparekh.tech"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
					>
						Mehul Parekh
					</a>
				</p>
			</footer>
		</div>
	);
}

export default App;
