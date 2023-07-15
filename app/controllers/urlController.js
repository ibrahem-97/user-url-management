const { default: axios } = require("axios");
const { Cheerio } = require("cheerio");

const URL = require("../models").URL;

const addURL = async (req, res) => {
  try {
    let { url } = req.body;

    user_id = req.user.userId;

    // Create a new URL
    const newURL = await URL.create({ user_id, url });

    res.status(200).json({
      success: true,
      message: "url_added_successfully",
      data: { id: newURL.id, url: newURL.url, user_id: newURL.user_id },
    });
  } catch (error) {
    console.error("Error in addURL:", error);
    res.status(500).json({
      error: true,
      message: "add_url_error",
      details: error.message,
    });
  }
};

const addURLById = async (req, res) => {
  try {
    let { user_id = null, url } = req.body;
    // check user is admin or not

    if (!user_id) {
      return res.status(404).json({
        error: true,
        message: "user_not_found",
      });
    }

    // Create a new URL
    const newURL = await URL.create({ user_id, url });

    res.status(200).json({
      success: true,
      message: "url_added_successfully",
      data: { id: newURL.id, url: newURL.url, user_id: newURL.user_id },
    });
  } catch (error) {
    console.error("Error in addURL:", error);
    res.status(500).json({
      error: true,
      message: "add_url_error",
      details: error.message,
    });
  }
};

const deleteURL = async (req, res) => {
  try {
    const { urlId } = req.params;

    // Check if the URL exists
    const url = await URL.findByPk(urlId);
    if (!url) {
      return res.status(404).json({
        error: true,
        message: "url_not_found",
      });
    }
    // check user is admin or not
    if (req.user.userId != url.user_id) {
      return res.status(401).json({
        error: true,
        message: "url_not_found",
      });
    }
    // Delete the URL
    await url.destroy();

    res.status(200).json({
      success: true,
      message: "url_deleted_successfully",
    });
  } catch (error) {
    console.error("Error in deleteURL:", error);
    res.status(500).json({
      error: true,
      message: "delete_url_error",
      details: error.message,
    });
  }
};

const scrapeURL = async (req, res) => {
  try {
    const { urlId } = req.params;

    // check the url exists
    const url = await URL.findByPk(urlId);
    if (!url) {
      return res.status(404).json({
        error: true,
        message: "url_not_found",
      });
    }
    // check user is admin or not
    if (req.user.type != "admin" && req.user.userId != url.user_id) {
      return res.status(401).json({
        error: true,
        message: "unauthorized",
      });
    }

    // Fetch the HTML content of the URL
    const response = await axios.get(url.url).catch((error) => {
      console.log(error);
      throw new Error(error.message);
    });

    const html = response.data;
 
    const title =  html.match(/<title[^>]*>([^<]+)<\/title>/)[1];

    // Update the URL with the page title
    url.title = title;
    await url.save();

    res.status(200).json({
      success: true,
      data: {...url.dataValues },
    });
  } catch (error) {
    console.error("Error in scrapeURL:", error);
    res.status(500).json({
      error: true,
      message: "url_scraping_error",
      details: error.message,
    });
  }
};

const getAllURLs = async (req, res) => {
  try {
    // Get all URLs
    const urls = await URL.findAll();

    res.status(200).json({
      success: true,
      data: urls,
    });
  } catch (error) {
    console.error("Error in getAllURLs:", error);
    res.status(500).json({
      error: true,
      message: "get_all_urls_error",
      details: error.message,
    });
  }
};

const getUserURLs = async (req, res) => {
  try {
    userId = req.user.userId;

    // Get URLs for the specified user
    const urls = await URL.findAll({ where: { user_id: userId } });
    if (urls.length === 0) {
      return res.status(404).json({
        error: true,
        message: "no_user_urls_found",
      });
    }

    res.status(200).json({
      success: true,
      data: urls,
    });
  } catch (error) {
    console.error("Error in getUserURLs:", error);
    res.status(500).json({
      error: true,
      message: "get_user_urls_error",
      details: error.message,
    });
  }
};

const getUserURLsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const urls = await URL.findAll({ where: { user_id: userId } });
    if (urls.length === 0) {
      return res.status(404).json({
        error: true,
        message: "no_user_urls_found",
      });
    }
    res.status(200).json({
      success: true,
      data: urls,
    });
  } catch (error) {
    console.error("Error in getUserURLsById:", error);
    res.status(500).json({
      error: true,
      message: "get_user_urls_error",
      details: error.message,
    });
  }
};

const deleteURLByUserID = async (req, res) => {
  try {
    const { userId, urlId } = req.params;
    // check user is admin or not
    if (req.user.type != "admin") {
      userId = req.user.userId;
    }
    // Check if the URL exists for the specified user
    const url = await URL.findOne({ where: { id: urlId, user_id: userId } });
    if (!url) {
      return res.status(404).json({
        error: true,
        message: "url_not_found",
      });
    }

    // Delete the URL
    await url.destroy();

    res.status(200).json({
      success: true,
      message: "url_deleted_successfully",
    });
  } catch (error) {
    console.error("Error in deleteURLForUser:", error);
    res.status(500).json({
      error: true,
      message: "delete_url_for_user_error",
      details: error.message,
    });
  }
};

module.exports = {
  addURL,
  deleteURL,
  scrapeURL,
  getAllURLs,
  getUserURLs,
  deleteURLByUserID,
  getUserURLsById,
  addURLById,
};
