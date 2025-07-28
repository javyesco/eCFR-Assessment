import {Card, Col, Row} from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import React from "react";
import '../../../css/BasicComponentList.css';
import '../../../css/Divider.css'

export const EcfrAgenciesCardPane = ({ agencies }) => {
    return (
        <Row key={agencies.id}>
            <Card style={{ width: "100%" }} bg="dark" className="basic-component-list">
                <Card.Body style={{ color: "white"}}>
                    <Row>
                        <Col md={8}>
                            <Card.Title className="mb-2" style={{ color: "#cf6a4c" }}>
                                <h5><strong>{agencies.name}</strong></h5>
                            </Card.Title>
                            {agencies.short_name && (
                                <Card.Subtitle className="mb-2 text-muted">
                                    {agencies.short_name}
                                </Card.Subtitle>
                            )}
                            <Card.Text>
                                <strong>Display Name:</strong> {agencies.display_name}
                            </Card.Text>
                        </Col>
                        <Col md={4} className="text-end">
                            <div className="mb-2">
                                <strong>Word Count:</strong> 
                                <span className="text-info ms-2">{agencies.word_count?.toLocaleString()}</span>
                            </div>
                            <div className="mb-2">
                                <strong>CFR References:</strong> 
                                <span className="text-warning ms-2">{agencies.cfr_reference_count}</span>
                            </div>
                            {agencies.cfr_titles && (
                                <div className="mb-2">
                                    <strong>CFR Titles:</strong> 
                                    <span className="text-success ms-2">{agencies.cfr_titles}</span>
                                </div>
                            )}
                            <small className="text-muted">
                                Updated: {new Date(agencies.updated_at).toLocaleDateString()}
                            </small>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Row>
    );
}
