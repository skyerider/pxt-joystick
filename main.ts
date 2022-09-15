enum barb_fitting {
    //% block="LEFT"
    JOYSTICK_BUTOON_LEFT_L = 0,
    //% block="RIGHT" 
    JOYSTICK_BUTOON_RIGHT_R = 1,
    //% block="LEFTA"
    JOYSTICK_BUTTON_LEFT = 2,
    //% block="RIGHTA" 
    JOYSTICK_BUTTON_RIGHT = 3,
}

enum key_status {
    //% block="DOWN"
    JOYSTICK_PRESS_DOWN = 0,   //按下
    //% block="UP"
    JOYSTICK_PRESS_UP = 1,    //释放
    // //% block="CLICK1"
    // SINGLE_CLICK = 3,     //单击
    // //% block="CLICK2"
    // DOUBLE_CLICK = 4,    //双击
    // //% block="HOLD"
    // LONG_PRESS_HOLD = 6,    //长按
    // //% block="PRESS"
    // NONE_PRESS = 8,      //未按
}

enum Shaft{
    //% block="X"
    JOYSTICK_X_Shaft = 0,
    //% block="Y"
    JOYSTICK_Y_Shaft = 1,
}

enum Wiggly{
    //% block="LEFT"
    JOYSTICK_left_wi = 0,
    //% block="RIGHT"
    JOYSTICK_right_wi = 1,
}


//% color="#FFA500" weight=10 icon="\uf2c9" block="手柄"
namespace joystick {
    
    let i2cAddr: number
    let BK: number
    let RS: number
    function setreg(d: number) {
        pins.i2cWriteNumber(i2cAddr, d, NumberFormat.Int8LE)
        basic.pause(1)
    }

    function set(d: number) {
        d = d & 0xF0
        d = d + BK + RS
        setreg(d)
        setreg(d + 4)
        setreg(d)
    }

    function lcdcmd(d: number) {
        RS = 0
        set(d)
        set(d << 4)
    }

    function lcddat(d: number) {
        RS = 1
        set(d)
        set(d << 4)
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cwrite1(addr: number, reg: number, value: number ,value1: string) {
        let lengths = value1.length
        let buf = pins.createBuffer(2+lengths)
        //let arr = value1.split('')
        buf[0] = reg 
        buf[1] = value
        let betys = []
        betys = stringToBytes(value1)
        for (let i = 0; i < betys.length; i++) {
            buf[2+i] = betys[i]
        }
        pins.i2cWriteBuffer(addr, buf)
    }
    
    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    
    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function stringToBytes (str : string) {  

        
        let ch = 0;
        let st = 0;
        let gm:number[]; 
        gm = [];
        for (let i = 0; i < str.length; i++ ) { 
            ch = str.charCodeAt(i);  
            st = 0 ;                 

           do {  
                st = ( ch & 0xFF );  
                ch = ch >> 8;   
                gm.push(st);        
            }    

            while ( ch );  
            
        }  
        return gm;  
    } 

    let JOYSTICK_I2C_ADDR = 0x5A;
    let JOYSTICK_LEFT_X_REG = 0x10;
    let JOYSTICK_LEFT_Y_REG = 0x11;
    let JOYSTICK_RIGHT_X_REG = 0x12;
    let JOYSTICK_RIGHT_Y_REG = 0x13;


    let BUTOON_LEFT_REG = 0x22;
    let BUTOON_RIGHT_REG = 0x23;
    let JOYSTICK_BUTTON_RIGHT = 0x21;
    let JOYSTICK_BUTTON_LEFT = 0x20;
    let NONE_PRESS = 8;

    function Get_Button_Status (button : number){
        switch(button) {
            case 0: 
                return i2cread(JOYSTICK_I2C_ADDR,BUTOON_LEFT_REG);
            case 1: 
                return i2cread(JOYSTICK_I2C_ADDR,BUTOON_RIGHT_REG);
            case 2: 
                return i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_BUTTON_LEFT);
            case 3: 
                return i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_BUTTON_RIGHT);
            default:
                return 0xff;
        }
    }

    /**
     * 双摇杆手柄
     */
    //% blockId=Gamepad_Press block="手柄按键 %button 是否被按下?" group="双摇杆手柄"
    //% weight=74
    //% subcategory="双摇杆手柄"
    //% inlineInputMode=inline
    export function Gamepad_Press(button: barb_fitting): boolean {
        if(Get_Button_Status(button) != NONE_PRESS && Get_Button_Status (button) != 0xff){
            return true;
        }
        return false;
    }

    /** 
     * 双摇杆手柄
    */
   //% blockId=Gamepad_Release block="手柄按键 %button 是否被释放？" group="双摇杆手柄"
   //% weight=74
   //% subcategory="双摇杆手柄"
   //% inlineInputMode=inline
   export function Gamepad_Release(button: barb_fitting): boolean {
       if(Get_Button_Status(button) == NONE_PRESS){
           return true;
       }
       return false;
   }

   /**
    * 双摇杆手柄
    */
   //% blockId=Gamepad_Status block="按键 %button 是否是 %status 状态" group="双摇杆手柄"
   //% weight=74
   //% subcategory="双摇杆手柄"
   //% inlineInputMode=inline
   export function Gamepad_Status(button: barb_fitting , status: key_status): boolean{
       if(Get_Button_Status(button) == status){
           return true;
       }
       return false;
    }


    /**
    * 双摇杆手柄
    */
   //% blockId=Gamepad_shock block="游戏手柄震动频率 %shock "  group="双摇杆手柄"
   //% shock.min=0 shock.max=1000
   //% weight=74
   //% subcategory="双摇杆手柄"
   //% inlineInputMode=inline
    export function Gamepad_shock( shock: number): void {
        let a = AnalogPin.P1;
        pins.analogWritePin( a , shock)
    }


    //% blockId=actuator_buzzer1 block="板载蜂鸣器的频率: %freq "   group="双摇杆手柄"
    //% freq.min=0 freq.max=1000
    //% weight=74
    //% subcategory="双摇杆手柄"
    export function actuator_buzzer1( freq: number): void {
        let a = AnalogPin.P0;
        pins.analogWritePin(a, freq)
    }

    /**
    * 双摇杆手柄
    */
   //% blockId=Gamepad_Wiggly block="游戏手柄摇杆获取 %rock %axial 的值" group="双摇杆手柄"
   //% weight=74
   //% subcategory="双摇杆手柄"
   //% inlineInputMode=inline
   export function Gamepad_Wiggly(rock: Wiggly , axial: Shaft){
       let val = 0;
       if(rock == 0){
           if(axial == 0){
               val = i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_LEFT_X_REG);
           }else{
               val = i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_LEFT_Y_REG);
           }
       }else{
           if(axial == 0){
               val = i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_RIGHT_X_REG);
           }else{
               val = i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_RIGHT_Y_REG);
           }
       }
       return val;
   }
}

