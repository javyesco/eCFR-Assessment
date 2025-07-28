import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Alert, Spinner } from "react-bootstrap";
import agenciesService from "../../../services/ecfr/ecfrServices";

function EcfrWordCountPane() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchWordCountAnalysis();
    }, []);

    const fetchWordCountAnalysis = async () => {
        try {
            setIsLoading(true);
            const response = await agenciesService.getWordCountAnalysis();
            setData(response.data);
            setError("");
        } catch (error) {
            setError("Failed to fetch word count analysis");
            console.error("Word count analysis error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading word count analysis...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert variant="danger" className="mt-4">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className="mt-4 mb-4">Word Count Analysis</h2>
                </Col>
            </Row>

            {/* Summary Statistics */}
            {data?.summary && (
                <Row className="mb-4">
                    <Col>
                        <Card bg="dark" text="white">
                            <Card.Header>
                                <h4>Summary Statistics</h4>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={3}>
                                        <h5>Total Agencies</h5>
                                        <p className="h3 text-primary">{data.summary.total_agencies}</p>
                                    </Col>
                                    <Col md={3}>
                                        <h5>Total Words</h5>
                                        <p className="h3 text-success">{data.summary.total_words?.toLocaleString()}</p>
                                    </Col>
                                    <Col md={3}>
                                        <h5>Average Words</h5>
                                        <p className="h3 text-warning">{Math.round(data.summary.avg_words_per_agency)}</p>
                                    </Col>
                                    <Col md={3}>
                                        <h5>Max Words</h5>
                                        <p className="h3 text-info">{data.summary.max_words?.toLocaleString()}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Agencies Table */}
            {data?.agencies && (
                <Row style={{height: "80vh", overflowY: "auto" }}>
                    <Col>
                        <Card bg="dark" text="white">
                            <Card.Header>
                                <h4>Agencies by Word Count</h4>
                            </Card.Header>
                            <Card.Body>
                                <Table striped bordered hover variant="dark" responsive>
                                    <thead>
                                        <tr>
                                            <th>Agency Name</th>
                                            <th>Short Name</th>
                                            <th>Word Count</th>
                                            <th>CFR References</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.agencies.map((agency, index) => (
                                            <tr key={index}>
                                                <td>{agency.name}</td>
                                                <td>{agency.short_name || 'N/A'}</td>
                                                <td>{agency.word_count?.toLocaleString()}</td>
                                                <td>{agency.cfr_reference_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default EcfrWordCountPane;
