package com.example.appointment_booking.appointment;

import com.example.appointment_booking.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "http://localhost:4200")
public class AppointmentController {

    @Autowired
    private AppointmentRepository repository;

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Appointment> getAppointmentById(@PathVariable Long id) {
        return repository.findById(id);
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return repository.save(appointment);
    }

    @PutMapping("/{id}")
    public Appointment updateAppointment(@PathVariable Long id, @RequestBody Appointment updated) {
        return repository.findById(id).map(existing -> {
            existing.setServiceType(updated.getServiceType());
            existing.setAppointmentTime(updated.getAppointmentTime());
            existing.setUser(updated.getUser());
            return repository.save(existing);
        }).orElseGet(() -> {
            updated.setId(id);
            return repository.save(updated);
        });
    }

    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
