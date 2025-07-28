import axios from "axios";

class ecfrServices {
    // Base NGROK URL for API calls
    getBaseNGROKURL() {
        return `REPLACE_WITH_BASE_NGROK_URL`;
    }

    // Common headers for API calls
    getHeaders() {
        return {
            'ngrok-skip-browser-warning': 'true'
        };
    }

    async storeAgencies() {
        try {
            const baseURL = `${this.getBaseNGROKURL()}/download`;
            const response = await axios.post(baseURL, {}, {
                headers: this.getHeaders()
            });
            return response;
        } catch (error) {
            console.error("An error occurred while storing agenciesPane: " + error);
            throw error;
        }
    }

    async getAgencies() {
        try {
            const baseURL = `${this.getBaseNGROKURL()}/agencies`;
            const response = await axios.get(baseURL, {
                headers: this.getHeaders()
            });
            return response;
        } catch (error) {
            console.error("An error occurred while fetching stored agenciesPane: " + error);
            throw error;
        }
    }

    async getWordCountAnalysis() {
        try {
            const baseURL = `${this.getBaseNGROKURL()}/analysis/word-count`;
            const response = await axios.get(baseURL, {
                headers: this.getHeaders()
            });
            return response;
        } catch (error) {
            console.error("An error occurred while fetching word count analysis: " + error);
            throw error;
        }
    }

    async getChecksums() {
        try {
            const baseURL = `${this.getBaseNGROKURL()}/analysis/checksums`;
            const response = await axios.get(baseURL, {
                headers: this.getHeaders()
            });
            return response;
        } catch (error) {
            console.error("An error occurred while fetching checksums: " + error);
            throw error;
        }
    }

    async getHistoricalChanges() {
        try {
            const baseURL = `${this.getBaseNGROKURL()}/analysis/history`;
            const response = await axios.get(baseURL, {
                headers: this.getHeaders()
            });
            return response;
        } catch (error) {
            console.error("An error occurred while fetching historical changes: " + error);
            throw error;
        }
    }

    async getComplexityScore() {
        try {
            const baseURL = `${this.getBaseNGROKURL()}/analysis/complexity`;
            const response = await axios.get(baseURL, {
                headers: this.getHeaders()
            });
            return response;
        } catch (error) {
            console.error("An error occurred while fetching complexity score: " + error);
            throw error;
        }
    }
}

export default new ecfrServices();
