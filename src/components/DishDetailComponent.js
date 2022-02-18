import React, {Component} from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    CardBody,
    CardImg,
    CardText,
    CardTitle,
    Col,
    Label,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from 'reactstrap';
import {Link} from "react-router-dom";
import {Control, Errors, LocalForm} from "react-redux-form";

const minLength = (len) => (val) => (val) && (val.length >= len);
const maxLength = (len) => (val) => (val) && (val.length <= len);


function RenderDish({dish}) {
    if (dish != null) {
        return (
            <Card key={dish.id}>
                <CardImg top src={dish.image} alt={dish.name}/>
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        )
    } else return <div/>;
}

function RenderComments({comments, addComment, dishId}) {
    var options = {year: 'numeric', month: 'long', day: 'numeric'};
    const cmnts = comments.map((comment) => {
        var date = new Date(comment.date).toLocaleDateString('en-US', options);
        return (
            <>
                <ListGroup key={comment.id}>
                    <ListGroupItem className="border-0">{comment.comment}</ListGroupItem>

                    <ListGroupItem className="border-0">
                        --{comment.author}, {date}
                    </ListGroupItem>
                </ListGroup>
            </>
        );
    });
    if (cmnts != null) {
        if (cmnts.length !== 0) {
            return (
                <>
                    <h4>Comments</h4>
                    {cmnts}
                    <CommentForm dishId={dishId} addComment={addComment}/>
                </>
            );
        }
    }
}

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        }
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit = (val) => {
        this.toggleModal();
        this.props.addComment(this.props.dishId, val.rating, val.author, val.comment);
    }

    render = () => {
        return (
            <>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="rating">Rating</Label>
                                    <Control.select model=".rating" default name="rating" className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="author">Your Name</Label>
                                    <Control.text model=".author" id="author" name="author"
                                                  placeholder="Your Name"
                                                  className="form-control"
                                                  validators={{minLength: minLength(3), maxLength: maxLength(15)}}
                                    />

                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 3 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="comment">Comment</Label>
                                    <Control.textarea model={".comment"} id="comment" name="message"
                                                      rows="6"
                                                      className="form-control"/>
                                </Col>
                            </Row>
                            <Button type="submit" value="submit" color="primary">Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
                <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-pencil"> Submit Comment</span>
                </Button>
            </>
        );
    };
}


const DishDetail = (props) => {
    const dish = props.dish;

    return (
        <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{dish.name}</BreadcrumbItem>
                </Breadcrumb>
            </div>

            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    <RenderDish dish={dish}/>
                </div>

                <div className="col-12 col-md-5 m-1">
                    <RenderComments comments={props.comments}
                                    addComment={props.addComment}
                                    dishId={props.dish.id}
                    />
                </div>
            </div>
        </div>
    );
};


export default DishDetail;
