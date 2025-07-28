import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Alert, Spinner, ProgressBar } from "react-bootstrap";
import agenciesService from "../../../services/ecfr/ecfrServices";

function EcfrComplexityPane() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchComplexityScore();
    }, []);

    const fetchComplexityScore = async () => {
        try {
            setIsLoading(true);
            const response = await agenciesService.getComplexityScore();
            setData(response.data);
            setError("");
        } catch (error) {
            setError("Failed to fetch complexity score.");
            console.error("Complexity score fetching error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getComplexityBar = (score, maxScore) => {
        const percentage = (score / maxScore) * 100;
        let variant = 'success';
        
        if (percentage > 75) variant = 'danger';
        else if (percentage > 50) variant = 'warning';
        else if (percentage > 25) variant = 'info';
        
        return (
            <ProgressBar 
                now={percentage} 
                variant={variant} 
                label={`${score.toLocaleString()}`}
                style={{ minWidth: '100px' }}
            />
        );
    };

    if (isLoading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading complexity analysis...</p>
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

    const maxScore = data?.complexity_analysis?.length > 0 
        ? Math.max(...data.complexity_analysis.map(item => item.complexity_score)) 
        : 0;

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className="mt-4 mb-4">Regulatory Complexity Analysis</h2>
                </Col>
            </Row>

            {/* Description Card */}
            <Row className="mb-4">
                <Col>
                    <Card bg="info" text="white">
                        <Card.Body>
                            <h5>About Complexity Score</h5>
                            <p className="mb-0">
                                {data?.description || 
                                "The complexity score combines word count (70%) and CFR reference count (30%) to measure regulatory burden."}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Complexity Analysis Table */}
            <Row style={{height: "80vh", overflowY: "auto" }}>
                <Col>
                    <Card bg="dark" text="white">
                        <Card.Header>
                            <h4>Agencies by Complexity Score</h4>
                        </Card.Header>
                        <Card.Body>
                            {data?.complexity_analysis?.length === 0 ? (
                                <Alert variant="warning">
                                    No complexity data available. Please ensure agencies data has been downloaded.
                                </Alert>
                            ) : (
                                <Table striped bordered hover variant="dark" responsive>
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Agency Name</th>
                                            <th>Short Name</th>
                                            <th>Word Count</th>
                                            <th>CFR References</th>
                                            <th>Complexity Score</th>
                                            <th>Visual</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.complexity_analysis?.map((agency, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <strong>#{index + 1}</strong>
                                                </td>
                                                <td>{agency.name}</td>
                                                <td>{agency.short_name || 'N/A'}</td>
                                                <td>{agency.word_count?.toLocaleString()}</td>
                                                <td>{agency.cfr_reference_count}</td>
                                                <td>
                                                    <strong>{agency.complexity_score?.toLocaleString()}</strong>
                                                </td>
                                                <td style={{ minWidth: '150px' }}>
                                                    {getComplexityBar(agency.complexity_score, maxScore)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default EcfrComplexityPane;
