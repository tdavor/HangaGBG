import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.CodeSigner;
import java.util.HexFormat;
import java.util.jar.JarFile;
import java.util.jar.JarEntry;
import java.io.OutputStream;

// Verify every payload entry, not merely the presence of a signature file.
class VerifyBundle {
    public static void main(String[] args)throws Exception {
        int checked=0;
        try(JarFile bundle=new JarFile(Path.of(args[0]).toFile(),true)){
            var entries=bundle.entries();
            while(entries.hasMoreElements()){
                JarEntry entry=entries.nextElement();
                if(entry.isDirectory()||entry.getName().startsWith("META-INF/"))continue;
                try(var input=bundle.getInputStream(entry)){input.transferTo(OutputStream.nullOutputStream());}
                CodeSigner[] signers=entry.getCodeSigners();boolean valid=false;
                if(signers!=null)for(CodeSigner signer:signers){
                    byte[] cert=signer.getSignerCertPath().getCertificates().get(0).getEncoded();
                    String digest=HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(cert));
                    if(digest.equalsIgnoreCase(args[1]))valid=true;
                }
                if(!valid)throw new SecurityException("Unsigned or unexpected signer: "+entry.getName());
                checked++;
            }
        }
        if(checked==0)throw new SecurityException("Empty bundle");
        System.out.println("Verified upload certificate and signatures for "+checked+" bundle entries.");
    }
}
