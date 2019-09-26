import {requestData, sAlert} from "../helpers.js";

const DEV_API_URL = "http://localhost:5000/dsc-blog-c97d3/us-central1/app";
const API_URL = "https://us-central1-dsc-blog-c97d3.cloudfunctions.net/app";

export const getArticles = () => {
	return requestData({url: `${API_URL}/articles`, method: "get"}).catch(
		error => {
			console.log("Error Msg: " + error.message);
			console.log(error.stack);
		}
	);
};

export const getSingleArticle = aid => {
	return requestData({url: `${API_URL}/articles/${aid}`, method: "get"}).catch(
		error => {
			console.log("Error Msg: " + error.message);
			console.log(error.stack);
		}
	);
};

export const getCategories = () => {
	return requestData({url: `${API_URL}/categories`, method: "get"}).catch(
		error => {
			console.log("Error Msg: " + error.message);
			console.log(error.stack);
		}
	);
};

export const getArticlesByCategory = cid => {
	return requestData({
		url: `${API_URL}/articles/category/${cid}`,
		method: "get"
	}).catch(error => {
		console.log("Error Msg: " + error.message);
		console.log(error.stack);
	});
};

export const getUnpublishedArticles = () => {
	return requestData({
		url: `${API_URL}/articles/unpublished`,
		method: "get",
		authToken: localStorage.getItem("token") || ""
	}).catch(error => {
		console.log("Error Msg: " + error.message);
		console.log(error.stack);
	});
};

export const postSignIn = e => {
	e.preventDefault();
	const form = new FormData(e.target);
	return requestData({
		url: `${API_URL}/users/auth/login`,
		method: "post",
		data: JSON.stringify({
			email: form.get("email"),
			password: form.get("password")
		})
	})
		.then(res => {
			console.log(res);
			sAlert({
				title: res.popup || "Something went wrong",
				message: res.message,
				type: res.success ? "success" : "error"
			});
			if (res.token) {
				const expTime = new Date().getTime() + 86400 * 1000;
				localStorage.setItem("token", res.token);
				localStorage.setItem("exp", expTime);
				localStorage.setItem(
					"refresh",
					JSON.stringify({refreshToken: res.refreshToken, uid: res.uid})
				);
				window.location.href = "/dashboard.html";
			}
		})
		.catch(error => {
			console.log("Error Msg: " + error.message);
			console.log(error.stack);
		});
};

export const getNewToken = tokenData => {
	return requestData({
		url: `${API_URL}/auth/refresh_token`,
		method: "post",
		data: tokenData
	}).catch(error => {
		console.log("Error Msg: " + error.message);
		console.log(error.stack);
	});
};

export const getEndpoints = () => {
	return requestData(`${API_URL}/endpoints`, "get").catch(error => {
		console.log("Error Msg: " + error.message);
		console.log(error.stack);
	});
};

export const postApply = e => {
	e.preventDefault();
	const form = new FormData(e.target);
	return requestData({
		url: `${API_URL}/applications/contributor`,
		method: "post",
		data: JSON.stringify({
			firstname: form.get("firstname"),
			lastname: form.get("lastname"),
			email: form.get("email"),
			reason: form.get("reason")
		})
	})
		.then(res => {
			console.log(res);
			sAlert({
				title: res.success ? "Application Sent" : "Something went wrong",
				message: res.message,
				type: res.success ? "success" : "error"
			});
			if (res.success) {
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			}
		})
		.catch(error => {
			console.log("Error Msg: " + error.message);
			console.log(error.stack);
		});
};
