% Calculates the critial depth from data on Irradiance, conversion of
% irradiance into photosynthesis, respiration, and light attenuation.

% Assigning parameter values
    Io=25;      % Incoming irradiance
    alpha = 1;  % Coversion from irradiance to productivity
    R = 8;      % Respiratino
    k = .05;    % Light attenuation

% Equations for productivity and respiration
    % Depths (x) in 0.1 m increments
        x=0:0.1:200;
    % Productivity with depth
        Prod = Io*alpha*exp(-k*x);
    % Respiration with depth (as a vector of size x)
        Resp = R*ones(size(x));
        
% Calculating critical depth by comparing definite integrals
    % Initializing integrals and depth index
        Pint = 1; Rint = 0; index = 1;
    while Pint > Rint
        index = index + 1;
        % Calculate definite integrals from 0 to x(index)
            Pint = Io*alpha/k*(1-exp(-k*x(index)));
            Rint = R*x(index);
    end
    
% Critical depth is x(index)  
disp( ['Critical depth = ' num2str(x(index))])

% Plotting productivity, respiration and critical depth
plot(Prod,x,'g',Resp,x,'b',0:max(Prod),x(index)*ones(size([0:max(Prod)])),'r'); axis 'ij'; 
set(gca,'XAxisLocation','Top'); 
xlabel 'Productivity, Respiration (mg C m^{-2} d^{-1}')
ylabel 'Depth (m)'
legend('Productivity','Respiration','Critical Depth','Location','SouthEast')
figure(gcf)
