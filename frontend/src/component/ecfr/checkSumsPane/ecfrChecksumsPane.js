import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Alert, Spinner } from "react-bootstrap";
import agenciesService from "../../../services/ecfr/ecfrServices";

function EcfrChecksumsPane() {
    const [checksums, setChecksums] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchChecksums();
    }, []);

    const fetchChecksums = async () => {
        try {
            setIsLoading(true);
            const response = await agenciesService.getChecksums();
            setChecksums(response.data.checksums);
            setError("");
        } catch (error) {
            setError("Failed to fetch checksums.");
            console.error("Checksums fetching error:", error);
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
                <p className="mt-2">Loading checksums...</p>
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
                    <h2 className="mt-4 mb-4">Agency Checksums</h2>
                </Col>
            </Row>
            <Row>
                <Col style={{height: "80vh", overflowY: "auto" }}>
                    <Card bg="dark" text="white">
                        <Card.Header>
                            <h4>Checksums by Agency</h4>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover variant="dark" responsive>
                                <thead>
                                    <tr>
                                        <th>Agency Name</th>
                                        <th>Short Name</th>
                                        <th>Checksum</th>
                                        <th>Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checksums.map((agency, index) => (
                                        <tr key={index}>
                                            <td>{agency.name}</td>
                                            <td>{agency.short_name || 'N/A'}</td>
                                            <td>{agency.checksum}</td>
                                            <td>{new Date(agency.last_updated).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default EcfrChecksumsPane;
