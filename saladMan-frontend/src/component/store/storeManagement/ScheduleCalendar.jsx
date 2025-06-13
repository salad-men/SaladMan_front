import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import { Modal, Button, Form } from 'react-bootstrap';
import './ScheduleCalendar.css';

const staffList = [
    { id: '1', name: '김철수', color: '#4e73df' },
    { id: '2', name: '박영희', color: '#1cc88a' },
    { id: '3', name: '이민수', color: '#e74a3b' },
];

const shiftOptions = ['오픈', '미들', '마감'];

export default function ScheduleCalendar() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showShiftModal, setShowShiftModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '', start: '', end: '', description: '', staffId: '', shift: '', color: ''
    });
    const [shiftTimes, setShiftTimes] = useState({
        오픈: { start: '09:00', end: '13:00' },
        미들: { start: '13:00', end: '17:00' },
        마감: { start: '17:00', end: '21:00' },
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);

    const handleDateClick = (date) => {
        setNewEvent({ title: '', start: date.dateStr, end: date.dateStr, description: '', staffId: '', shift: '', color: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        setNewEvent({
            title: event.title,
            start: event.startStr,
            end: event.endStr,
            description: event.extendedProps.description || '',
            staffId: event.extendedProps.staffId || '',
            shift: event.extendedProps.shift || '',
            color: event.backgroundColor
        });
        setCurrentEventId(event.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSaveEvent = () => {
        const selectedStaff = staffList.find(s => s.id === newEvent.staffId);
        const shiftTime = shiftTimes[newEvent.shift];

        const dateStr = newEvent.start;
        const start = `${dateStr}T${shiftTime.start}`;
        const end = `${dateStr}T${shiftTime.end}`;

        const updatedEvent = {
            ...newEvent,
            title: `${selectedStaff?.name || '직원'} (${newEvent.shift})`,
            start,
            end,
            color: selectedStaff?.color,
            extendedProps: {
                description: newEvent.description,
                staffId: newEvent.staffId,
                shift: newEvent.shift,
            }
        };

        if (isEditing) {
            setEvents(events.map(event =>
                event.id === currentEventId ? { ...updatedEvent, id: currentEventId } : event
            ));
        } else {
            setEvents([...events, { ...updatedEvent, id: Date.now().toString() }]);
        }
        setShowModal(false);
        setNewEvent({ title: '', start: '', end: '', description: '', staffId: '', shift: '', color: '' });
    };

    const renderEventContent = (eventInfo) => (
        <div>
            <b>{eventInfo.event.title}</b>
            <div style={{ fontSize: '0.75rem', color: '#555' }}>{eventInfo.event.extendedProps.shift}</div>
        </div>
    );
    const allShiftStart = Object.values(shiftTimes).map(s => s.start);
    const allShiftEnd = Object.values(shiftTimes).map(s => s.end);

    const earliestStart = allShiftStart.sort()[0]; // 가장 이른 시간
    const latestEnd = allShiftEnd.sort().reverse()[0]; // 가장 늦은 시간
    return (
        <div className="fullcalendar-wrapper">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{
                    left: "title",
                    right: "dayGridMonth,timeGridWeek,addEventButton,shiftSettingButton"
                }}
                customButtons={{
                    addEventButton: {
                        text: '스케줄 추가+',
                        click: () => {
                            setNewEvent({ title: '', start: '', end: '', description: '', staffId: '', shift: '', color: '' });
                            setIsEditing(false);
                            setShowModal(true);
                        }
                    },
                    shiftSettingButton: {
                        text: '시간대 설정',
                        click: () => setShowShiftModal(true)
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
                    list: "리스트"
                }}
                height={"600px"}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventContent={renderEventContent}
                expandRows={true}
                dayMaxEventRows={false}
                dayMaxEvents={false}
                titleFormat={{ month: 'long' }} // 오직 월만 표기
                slotMinTime={earliestStart}
                slotMaxTime={latestEnd}
            />

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? '스케줄 수정' : '새 스케줄 추가'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEventStaff">
                            <Form.Label>직원</Form.Label>
                            <Form.Control
                                as="select"
                                value={newEvent.staffId || ''}
                                onChange={(e) => {
                                    const selected = staffList.find(s => s.id === e.target.value);
                                    setNewEvent({
                                        ...newEvent,
                                        staffId: e.target.value,
                                        title: selected?.name || '',
                                        color: selected?.color || ''
                                    });
                                }}
                            >
                                <option value="">선택</option>
                                {staffList.map((staff) => (
                                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formShift">
                            <Form.Label>시간대</Form.Label>
                            <Form.Control
                                as="select"
                                value={newEvent.shift || ''}
                                onChange={(e) => setNewEvent({ ...newEvent, shift: e.target.value })}
                            >
                                <option value="">선택</option>
                                {shiftOptions.map((s, idx) => (
                                    <option key={idx} value={s}>{s}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
                    <Button variant="primary" onClick={handleSaveEvent}>저장</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showShiftModal} onHide={() => setShowShiftModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>시간대 설정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {shiftOptions.map((shift) => (
                            <div key={shift}>
                                <Form.Label>{shift}</Form.Label>
                                <div className="d-flex gap-2 mb-2">
                                    <Form.Control
                                        type="time"
                                        value={shiftTimes[shift].start}
                                        onChange={(e) =>
                                            setShiftTimes({
                                                ...shiftTimes,
                                                [shift]: { ...shiftTimes[shift], start: e.target.value }
                                            })
                                        }
                                    />
                                    <Form.Control
                                        type="time"
                                        value={shiftTimes[shift].end}
                                        onChange={(e) =>
                                            setShiftTimes({
                                                ...shiftTimes,
                                                [shift]: { ...shiftTimes[shift], end: e.target.value }
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowShiftModal(false)}>닫기</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
