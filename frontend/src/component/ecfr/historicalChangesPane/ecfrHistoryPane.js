import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Alert, Spinner, Badge } from "react-bootstrap";
import agenciesService from "../../../services/ecfr/ecfrServices";

function EcfrHistoryPane() {
    const [changes, setChanges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHistoricalChanges();
    }, []);

    const fetchHistoricalChanges = async () => {
        try {
            setIsLoading(true);
            const response = await agenciesService.getHistoricalChanges();
            setChanges(response.data.changes);
            setError("");
        } catch (error) {
            setError("Failed to fetch historical changes.");
            console.error("Historical changes fetching error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getChangeTypeBadge = (changeType) => {
        const variants = {
            'created': 'success',
            'updated': 'warning',
            'deleted': 'danger'
        };
        return (
            <Badge bg={variants[changeType] || 'secondary'}>
                {changeType}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading historical changes...</p>
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
                    <h2 className="mt-4 mb-4">Historical Changes</h2>
                </Col>
            </Row>
            <Row style={{height: "80vh", overflowY: "auto" }}>
                <Col>
                    <Card bg="dark" text="white">
                        <Card.Header>
                            <h4>Recent Changes ({changes.length} records)</h4>
                        </Card.Header>
                        <Card.Body>
                            {changes.length === 0 ? (
                                <Alert variant="info">
                                    No historical changes recorded yet. Changes will appear here when data is modified.
                                </Alert>
                            ) : (
                                <Table striped bordered hover variant="dark" responsive>
                                    <thead>
                                        <tr>
                                            <th>Entity Type</th>
                                            <th>Entity Name</th>
                                            <th>Change Type</th>
                                            <th>Old Checksum</th>
                                            <th>New Checksum</th>
                                            <th>Word Count Change</th>
                                            <th>Changed At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {changes.map((change, index) => (
                                            <tr key={index}>
                                                <td>{change.entity_type}</td>
                                                <td>{change.entity_name}</td>
                                                <td>{getChangeTypeBadge(change.change_type)}</td>
                                                <td>{change.old_checksum || 'N/A'}</td>
                                                <td>{change.new_checksum || 'N/A'}</td>
                                                <td>
                                                    {change.old_word_count && change.new_word_count ? 
                                                        `${change.old_word_count} → ${change.new_word_count}` : 
                                                        'N/A'
                                                    }
                                                </td>
                                                <td>{new Date(change.changed_at).toLocaleString()}</td>
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

export default EcfrHistoryPane;
