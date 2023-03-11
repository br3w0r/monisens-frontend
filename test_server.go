package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Starting test server...")

	http.HandleFunc("/service/start-device-init", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, `{"device_id":2,"conn_params":[{"name":"IP","typ":"String"},{"name":"Port","typ":"Int"},{"name":"Message","typ":"String"},{"name":"Use TLS","typ":"Bool"},{"name":"Very important conf","typ":"Float"}]}`)
	})

	http.HandleFunc("/service/connect-device", func(w http.ResponseWriter, _ *http.Request) {
		w.Write([]byte{})
	})

	http.HandleFunc("/service/obtain-device-conf-info", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, `{"device_conf_info":[{"id":1,"name":"Device comminucation interval (in seconds)","data":{"Int":{"required":true,"default":null,"lt":300,"gt":0,"neq":null}}},{"id":0,"name":"Message","data":{"Section":[{"id":2,"name":"Message type","data":{"ChoiceList":{"required":true,"default":0,"choices":["UNIX Timestamp","CPU Usage","Text Message"]}}},{"id":3,"name":"Message text (if type text)","data":{"String":{"required":false,"default":"TEST","min_len":null,"max_len":255,"match_regex":null}}},{"id":0,"name":"Event more embedded section","data":{"Section":[{"id":4,"name":"Test Int Range","data":{"IntRange":{"required":false,"def_from":null,"def_to":10,"min":-100,"max":100}}},{"id":5,"name":"Test Float","data":{"Float":{"required":true,"default":null,"lt":300,"gt":0}}},{"id":6,"name":"Test Float Range","data":{"FloatRange":{"required":false,"def_from":0,"def_to":null,"min":-100,"max":100}}},{"id":7,"name":"Test JSON","data":{"JSON":{"required":false,"default":"{\"test\": true}"}}}]}}]}}]}`)
	})

	http.HandleFunc("/service/configure-device", func(w http.ResponseWriter, _ *http.Request) {
		w.Write([]byte{})
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func writeJSON(w http.ResponseWriter, data string) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(data))
}
