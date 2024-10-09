import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// The listDocuments function, which fetches documents based on folder_id
const listDocuments = async (folder_id) => {
  const response = await fetch(
    `https://getcody.ai/web/documents?page=1&per_page=15&directory_id=123651&order_by=title&order_direction=asc`,
    {
      method: "GET",
      headers: {
        //Authorization: `Bearer ${process.env.API_TOKEN}`, // Add auth header if required
        "Content-Type": "application/json",
        cookie: process.env.COOKIE,
        "x-xsrf-token": process.env.XSRF,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const { data } = await response.json();
  return data;
};

// Proxy endpoint to expose listDocuments to the front end
app.get("/api/list-documents", async (req, res) => {
  try {
    // const { folder_id } = req.query; // Expect folder_id as a query parameter
    // if (!folder_id) {
    //   return res.status(400).json({ error: "Folder ID is required" });
    // }

    // Call the listDocuments function and return the data
    const data = await listDocuments(1);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
