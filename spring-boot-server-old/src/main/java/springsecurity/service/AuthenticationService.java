package springsecurity.service;

import springsecurity.payload.request.AuthenticationRequest;
import springsecurity.payload.request.RegisterRequest;
import springsecurity.payload.response.AuthenticationResponse;

public interface AuthenticationService {
    AuthenticationResponse register(RegisterRequest request);
    AuthenticationResponse authenticate(AuthenticationRequest request);
}
