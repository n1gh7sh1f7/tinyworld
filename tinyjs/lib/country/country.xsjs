function saveCountry(country) {
	var con = $.hdb.getConnection();

	var output = JSON.stringify(country);

	var fnCreateCountry = con.loadProcedure("tinyworld.tinydb::createCountry");

	var result = fnCreateCountry({
		IM_COUNTRY: country.name,
		IM_CONTINENT: country.partof
	});

	con.commit();

	con.close();

	if (result && result.EX_ERROR !== null) {
		return {body : result, status: $.net.http.BAD_REQUEST};
	} else {
		return {body : output, status: $.net.http.CREATED};
	}

}

var body = $.request.body.asString();

var country = JSON.parse(body);

// validate the inputs here

var output = saveCountry(country);

$.response.contentType = "application/json";

$.response.setBody(output.body);

$.response.status = output.status;