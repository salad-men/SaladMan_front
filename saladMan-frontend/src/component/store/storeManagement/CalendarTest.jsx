import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import { Modal, Button, Form } from 'react-bootstrap';
import "./CalendarTest.css";

function CalendarTest() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);

    const handleDateClick = (date) => {
        setNewEvent({ title: '', start: date.dateStr, end: date.dateStr, description: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        setNewEvent({
            title: event.title,
            start: event.startStr,
            end: event.endStr,
            description: event.extendedProps.description || ''
        });
        setCurrentEventId(event.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSaveEvent = () => {
        if (isEditing) {
            setEvents(events.map(event =>
                event.id === currentEventId ? { ...newEvent, id: currentEventId } : event
            ));
        } else {
            setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
        }
        setShowModal(false);
        setNewEvent({ title: '', start: '', end: '', description: '' });
    };

    const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

    const renderEventContent = (eventInfo) => {
        return (
            <div>
                <b>{eventInfo.timeText}</b>
                {eventInfo.view.type !== 'dayGridMonth' && <i>{eventInfo.event.title}</i>}
            </div>
        );
    };

    return (
        <div className="fullcalendar-wrapper">
            <FullCalendar
                plugins={plugins}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{
                    left: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay today,addEventButton"
                }}
                customButtons={{
                    addEventButton: {
                        text: '+',
                        click: () => {
                            setNewEvent({ title: '', start: '', end: '', description: '' });
                            setIsEditing(false);
                            setShowModal(true);
                        }
                    }
                }}
                footerToolbar={{
                    left: "prev",
                    center: "",
                    right: "next"
                }}
                buttonText={{
                    today: "오늘",
                    month: "월별",
                    week: "주별",
                    day: "일별",
                    list: "리스트"
                }}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventContent={renderEventContent} // 이벤트 콘텐츠 커스터마이즈 함수 추가
                expandRows={true} // 행 확장을 활성화하여 모든 이벤트 표시
                dayMaxEventRows={false} // 최대 이벤트 행 수를 비활성화
                dayMaxEvents={false} // 최대 이벤트 수를 비활성화
            />

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? '일정 수정' : '새 일정 추가'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEventTitle">
                            <Form.Label>제목</Form.Label>
                            <Form.Control
                                type="text"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEventDescription">
                            <Form.Label>내용</Form.Label>
                            <Form.Control
                                type="text"
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEventStart">
                            <Form.Label>시작 시간</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={newEvent.start}
                                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEventEnd">
                            <Form.Label>종료 시간</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={newEvent.end}
                                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleSaveEvent}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CalendarTest;
