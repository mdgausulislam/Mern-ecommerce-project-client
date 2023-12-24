import React, { useState } from 'react';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory } from '../../redux/actions/categoryAction';
import CheckboxTree from 'react-checkbox-tree';
import { IoIosArrowDropdown, IoIosArrowForward, IoIosCheckbox, IoIosCheckboxOutline } from "react-icons/io";
import 'react-checkbox-tree/lib/react-checkbox-tree.css';


const Category = () => {
    const category = useSelector(state => state.category);
    const [show, setShow] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [checkedArray, setCheckedArray] = useState([]);
    const [expandeddArray, setExpandedArray] = useState([]);
    const [updateCategoryModal, setUpdateCategoryModal] = useState(false);
    const dispatch = useDispatch();


    const handleClose = () => {

        const form = new FormData();

        if (categoryName === "") {
            alert('Category name is required');
            setShow(false);
            return;
        }

        form.append('name', categoryName);
        form.append('parentId', parentCategoryId);
        form.append('categoryImage', categoryImage);
        dispatch(addCategory(form));
        setCategoryName('');
        setParentCategoryId('');
        setShow(false);
    }

    const handleShow = () => setShow(true);

    const showCategoryData = (categories) => {
        let myCategories = [];
        for (let category of categories) {
            myCategories.push(
                {
                    label: category.name,
                    value: category._id,
                    children: category.children.length > 0 && showCategoryData(category.children)
                }
            );
        }
        return myCategories;

    }

    const createCategoryList = (categories, options = []) => {
        for (let category of categories) {
            options.push({
                value: category._id,
                name: category.name,
                parentId: category.parentId,
                type: category.type
            });
            if (category.children.length > 0) {
                createCategoryList(category.children, options)
            }
        }

        return options;
    }

    const handleCategoryImage = (e) => {
        setCategoryImage(e.target.files[0])
    }

    const updateCategory = () => {
        setUpdateCategoryModal(true);
        const categories = createCategoryList(category.categories);

        const checkedArray = [];
        const expandedArray = [];
        checked.length > 0 && checked.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId == category.value)
            category && checkedArray.push(category)
        })
        expanded.length > 0 && expanded.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId == category.value)
            category && expandedArray.push(category)
        })
        setCheckedArray(checkedArray)
        setExpandedArray(expandedArray)
        console.log({ checked, expanded, categories, checkedArray, expandedArray });
    }

    const handleCategoryInput = (key, value, index, type) => {
        if (type == "checked") {
            const updatedCheckedArray = checkedArray.map((item, _index) => index == _index ? { ...item, [key]: value } : item);
            setCheckedArray(updatedCheckedArray);
        } else if (type == "expanded") {
            const updatedExpendedArray = expandeddArray.map((item, _index) => index == _index ? { ...item, [key]: value } : item);
            setExpandedArray(updatedExpendedArray);

        }
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col md={12}>

                        <div className='d-flex justify-content-between'>
                            <h3>category</h3>
                            <button onClick={handleShow}>Add</button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>

                        <CheckboxTree
                            nodes={showCategoryData(category.categories)}
                            checked={checked}
                            expanded={expanded}
                            onCheck={checked => setChecked(checked)}
                            onExpand={expanded => setExpanded(expanded)}

                            icons={{
                                check: <IoIosCheckbox />,
                                uncheck: <IoIosCheckboxOutline />,
                                halfCheck: <IoIosCheckboxOutline />,
                                expandClose: <IoIosArrowForward />,
                                expandOpen: <IoIosArrowDropdown />,
                            }}
                        />

                    </Col>
                </Row>
                <Row>
                    <Col>
                        <button>Delete</button>
                        <button onClick={updateCategory}>Edit</button>
                    </Col>
                </Row>
            </Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control mb-3"
                        value={categoryName}
                        placeholder={`Category Name`}
                        onChange={(e) => setCategoryName(e.target.value)} />

                    <select
                        className="form-control mb-3"
                        value={parentCategoryId}
                        onChange={(e) => setParentCategoryId(e.target.value)}>
                        <option>select category</option>
                        {
                            createCategoryList(category.categories).map(option =>
                                <option
                                    key={option.value}
                                    value={option.value}>
                                    {option.name}
                                </option>
                            )
                        }
                    </select>
                    <input type="file" name="categoryImage" onChange={handleCategoryImage} />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* edit categories */}
            <Modal show={updateCategoryModal} onHide={() => setUpdateCategoryModal(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Update Categories</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Row>
                        <Col>
                            <h6>Expanded</h6>
                        </Col>
                    </Row>

                    {
                        expandeddArray.length > 0 &&
                        expandeddArray.map((item, index) =>
                            <Row key={index}>
                                <Col>
                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        value={item.name}
                                        placeholder={`Category Name`}
                                        onChange={(e) => handleCategoryInput('name', e.target.value, index, 'expanded')} />

                                </Col>
                                <Col>
                                    <select
                                        className="form-select mb-3"
                                        value={item.parentId}
                                        onChange={(e) => handleCategoryInput('parentId', e.target.value, index, 'expanded')}>
                                        <option>select category</option>
                                        {
                                            createCategoryList(category.categories).map(option =>
                                                <option
                                                    key={option.value}
                                                    value={option.value}>
                                                    {option.name}
                                                </option>
                                            )
                                        }
                                    </select>
                                </Col>
                                <Col>
                                    <select className="form-select mb-3">
                                        <option value=''>Select Type</option>
                                        <option value='store'>Store</option>
                                        <option value='product'>Product</option>
                                        <option value='page'>Page</option>
                                    </select>
                                </Col>
                            </Row>

                        )
                    }
                    <h1>Checked Category</h1>
                    {
                        checkedArray.length > 0 &&
                        checkedArray.map((item, index) =>
                            <Row key={index}>
                                <Col>
                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        value={item.name}
                                        placeholder={`Category Name`}
                                        onChange={(e) => handleCategoryInput('name', e.target.value, index, 'checked')} />

                                </Col>
                                <Col>
                                    <select
                                        className="form-select mb-3"
                                        value={item.parentId}
                                        onChange={(e) => handleCategoryInput('parentId', e.target.value, index, 'checked')}>
                                        <option>select category</option>
                                        {
                                            createCategoryList(category.categories).map(option =>
                                                <option
                                                    key={option.value}
                                                    value={option.value}>
                                                    {option.name}
                                                </option>
                                            )
                                        }
                                    </select>
                                </Col>
                                <Col>
                                    <select className="form-select mb-3">
                                        <option value=''>Select Type</option>
                                        <option value='store'>Store</option>
                                        <option value='product'>Product</option>
                                        <option value='page'>Page</option>
                                    </select>
                                </Col>
                            </Row>

                        )
                    }

                    {/* <input type="file" name="categoryImage" onChange={handleCategoryImage} /> */}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Category;

