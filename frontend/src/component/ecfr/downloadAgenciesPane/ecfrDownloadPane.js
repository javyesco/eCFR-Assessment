import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useToast } from "@chakra-ui/react";
import agenciesService from "../../../services/ecfr/ecfrServices";

function EcfrDownloadPane() {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleDownload = async () => {
        setIsLoading(true);
        
        try {
            const response = await agenciesService.storeAgencies();
            const responseData = response.data;
            
            // Check if new data was downloaded or if no changes occurred
            if (responseData.total_agencies === 0) {
                toast({
                    title: "No Data Available",
                    description: "No agencies data was found from the API source.",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                });
            } else if (responseData.message && responseData.message.includes("successfully")) {
                toast({
                    title: "Download Successful",
                    description: `Successfully downloaded and stored ${responseData.total_agencies || 'all'} agencies.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Download Complete",
                    description: responseData.message || "Agencies data has been processed.",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Download error:", error);
            
            // Check if it's a network error or API error
            if (error.response) {
                toast({
                    title: "Download Failed",
                    description: `Server error (${error.response.status}): ${error.response.data?.message || 'Unable to download agencies data.'}`,
                    status: "error",
                    duration: 8000,
                    isClosable: true,
                });
            } else if (error.request) {
                toast({
                    title: "Connection Failed",
                    description: "Unable to connect to the server. Please check your internet connection and try again.",
                    status: "error",
                    duration: 8000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Download Failed",
                    description: "An unexpected error occurred while downloading agencies data. Please try again.",
                    status: "error",
                    duration: 8000,
                    isClosable: true,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card bg="dark" text="white" className="mt-4">
                        <Card.Header>
                            <h3>Download eCFR Agencies Data</h3>
                        </Card.Header>
                        <Card.Body>
                            <p>
                                Click the button below to download the latest eCFR agencies data 
                                from the official API and store it in the database.
                            </p>
                            
                            <div className="d-grid gap-2 mt-4">
                                <Button 
                                    variant="primary" 
                                    size="lg" 
                                    onClick={handleDownload}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Downloading...
                                        </>
                                    ) : (
                                        "Download Agencies Data"
                                    )}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default EcfrDownloadPane;
